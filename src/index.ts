import 'source-map-support/register';

import { readFile, writeFile, exists } from 'fs';
import { promisify } from 'util';
import { createInterface } from 'readline';
import { PlurkClient } from 'plurk2';
import { APIStructs } from './api-structs';
import { readlineQuestionPromise, delay } from './utils';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const existsAsync = promisify(exists);

const CONFIG_FILE_PATH = 'config.json';
const keyword = /徵友/;
const replurkNotify = { qualifier: 'has', content: '已轉噗' };
const replurkRestrictedNotify = { qualifier: ':', content: '這功能只能由噗主使用' };
function nickName2Reply(nickName: string) {
  return `@${nickName}:`;
}

interface ConfigFile {
  accessToken?: string;
  accessTokenSecret?: string;
  consumerKey?: string;
  consumerSecret?: string;
}

const replurkIds = new Set<number>();
const rejectedIds = new Map<number, string[]>();

async function main() {
  const config: ConfigFile = (await existsAsync(CONFIG_FILE_PATH)) ?
    JSON.parse(await readFileAsync(CONFIG_FILE_PATH, 'utf-8')) : {};

  let requireSave = false, tokenReady = false;
  if(!config.consumerKey || !config.consumerSecret) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    config.consumerKey = await readlineQuestionPromise(rl, 'Consumer Key: ');
    config.consumerSecret = await readlineQuestionPromise(rl, 'Consumer Secret: ');
    rl.close();
    requireSave = true;
  }

  const client = new PlurkClient(config.consumerKey, config.consumerSecret);

  if(config.accessToken && config.accessTokenSecret) {
    client.token = config.accessToken;
    client.tokenSecret = config.accessTokenSecret;
    try {
      await client.request('checkToken');
      console.log('Exists token detected!');
      tokenReady = true;
    } catch(e) { console.error(e.stack || e); }
  }

  if(!tokenReady) {
    await client.getRequestToken();
    console.log('Please go to this page to get your verifier code:', client.authPage);
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const verifier = await readlineQuestionPromise(rl, 'Verifier code: ');
    rl.close();
    await client.getAccessToken(verifier);
    config.accessToken = client.token;
    config.accessTokenSecret = client.tokenSecret;
    requireSave = true;
  }
  
  console.log('Login successfully!');

  if(requireSave)
    await writeFileAsync(CONFIG_FILE_PATH, JSON.stringify(config, undefined, 2));

  while(true) {
    const alerts = <APIStructs.Alert[]>await client.request('Alerts/getActive');
    for(const alert of alerts) {
      if(alert.type !== APIStructs.AlertType.mentioned) continue;
      try {
        const mentioned = <APIStructs.MentionedAlert>alert;
        const { plurk } = <APIStructs.GetPlurkResponse>await client.request('Timeline/getPlurk', {
          plurk_id: mentioned.plurk_id,
          minimal_data: true,
          minimal_user: true,
        });
        if(plurk.replurked || !keyword.test(plurk.content_raw))
          continue;
        if(plurk.owner_id !== mentioned.from_user.id) {
          let rejectNotify = rejectedIds.get(plurk.owner_id);
          if(!rejectNotify)
            rejectedIds.set(plurk.owner_id, rejectNotify = []);
          rejectNotify.push(mentioned.from_user.nick_name);
          continue;
        }
        replurkIds.add(plurk.plurk_id);
      } catch(e) { console.error(e.stack || e); }
    }
    if(replurkIds.size) {
      console.log('Collected these plurks requested to replurk:', [...replurkIds].join(', '));
      try {
        const result = <APIStructs.ReplurkResponse>await client.request('Timeline/replurk', { ids: [...replurkIds] });
        if(result.success) {
          for(const id of replurkIds)
            rejectedIds.delete(id);
        } else {
          const { results } = result;
          replurkIds.clear();
          for(let id in results)
            if(results[id].success) {
              const i = Number.parseInt(id);
              replurkIds.add(i);
              rejectedIds.delete(i);
            }
        }
      } catch(e) {
        console.error(e.stack || e);
        replurkIds.clear();
      }
    }
    if(replurkIds.size) {
      console.log('Successfully replurked these plurks:', [...replurkIds].join(', '));
      for(const plurk_id of replurkIds) {
        try {
          await client.request('Responses/responseAdd', Object.assign({ plurk_id }, replurkNotify));
        } catch(e) { console.error(e.stack || e); }
      }
      console.log('Notified all replurked users');
      replurkIds.clear();
    }
    if(rejectedIds.size) {
      console.log('These plurks are requested from non-owner:', [...rejectedIds.keys()].join(', '));
      for(const kvp of rejectedIds) {
        try {
          const reply = Object.assign({ plurk_id: kvp[0] }, replurkRestrictedNotify);
          reply.content = `${kvp[1].map(nickName2Reply).join('')} ${reply.content}`;
          await client.request('Responses/responseAdd', reply);
        } catch(e) { console.error(e.stack || e); }
      }
      console.log('Notified all failed users');
      rejectedIds.clear();
    }
    await delay(15000);
  }
}

void(main());
