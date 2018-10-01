export namespace APIStructs {
  export const enum YesNo {
    no = 0,
    yes = 1,
  }

  export const enum BirthdayPrivacy {
    hideAll = 0,
    hideYear = 1,
    showAll = 2,
  }

  export const enum Gender {
    female = 0,
    male = 1,
    notStatingOrOther = 2,
  }

  export const enum Relationship {
    notSaying = 'not_saying',
    single = 'single',
    married = 'married',
    divorced = 'divorced',
    engaged = 'engaged',
    inRelationship = 'in_relationship', 
    complicated = 'complicated',
    widowed = 'widowed',
    unstableRelationship = 'unstable_relationship',
    openRelationship = 'open_relationship'
  }

  export const enum CommentableState {
    unlimited = 0,
    disabledComments = 1,
    friendsOnly = 2,
  }

  export interface User {
    id: number;
    nick_name: string;
    display_name: string;
    premium: YesNo;
    has_profile_image: YesNo;
    avatar: string | null;
    location: string;
    default_lang: string;
    date_of_birth: Date;
    bday_privacy: BirthdayPrivacy;
    full_name: string;
    gender: Gender;
    karma: number;
    recruited: number;
    relationship: Relationship;
  }

  export interface Plurk {
    plurk_id: number;
    lang: string;
    qualifier: string;
    qualifier_translated: string;
    posted: Date;
    content: string;
    content_raw: string;
    owner_id: number;
    user_id: number;
    is_unread: YesNo;
    no_comments: CommentableState;
    plurk_type: number;
    response_count: number;
    responses_seen: number;
    limited_to: number[] | null;
    favorite: boolean;
    favorite_count: number;
    favorers: number[];
    replurkable: boolean;
    replurked: boolean;
    replurker_id: number;
    replurkers_count: number;
    replurkers: number[];
  }
  
  export const enum AlertType {
    friendshipRequest = 'friendship_request',
    friendshipPending = 'friendship_pending',
    newFan = 'new_fan',
    friendshipAccepted = 'friendship_accepted',
    newFriend = 'new_friend',
    privatePlurk = 'private_plurk',
    plurkLiked = 'plurk_liked',
    plurkReplurked = 'plurk_replurked',
    mentioned = 'mentioned',
    myResponded = 'my_responded',
  }
  
  export interface Alert {
    type: AlertType;
  }
  
  export interface MentionedAlert extends Alert {
    type: AlertType.mentioned;
    from_user: User;
    posted: Date;
    plurk_id: number;
    num_others: number;
    response_id: number | null;
  }

  export interface ReplurkResponse {
    success: boolean;
    results: {
      [id: number]: {
        success: boolean;
        error: string;
      }
    }
  }

  export interface GetPlurkResponse {
    plurk: Plurk;
    plurk_users: {
      [userId: number]: User;
    }
    user: User;
  }
}