import { Injectable }   from '@angular/core';
import { $WebSocket }   from 'angular2-websocket/angular2-websocket';
import { Observable }   from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/partition';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';


export interface Creds {
  username: string;
  password: string;
  token: string;
}

function noop() {};

interface Request {
  type: string;
  subtype: string;
  id: number;
  data: any;
}

interface Answer {
  type: string;
  subtype: string;
  id: number;
  error: number;
  errormessage: string;
  data: any;
}

interface Event {
  type: string;
  subtype: string;
  data: any;
}

interface Err {
  errno: number;
  message: string;
}


@Injectable()
export class GsmapiService {
  private ws: $WebSocket;
  private id = 0;
  private callbacks: { [key: number]: { (ans: Answer): void} } = {};
  private answers: Observable<Answer>;
  private events: Observable<Event>;
  private eventtypes: { [key: string]: Observable<any> } = {};
  private requestedEvents: string[];
  private credentials: Creds;
  private url: string;
  public loggedin = false;


  /**
   * Creates the websocket and logs in the user.
   * @param url {string} Url with protocol and port
   * @param credentials {Creds} Object with username/password or token
   * @returns Promise which succeds on successful login
   */
  public login(url: string, credentials: Creds) {
    if (this.ws) { // Refactor to allow relogins.
      return Promise.reject({
        errno: -1,
        message: 'Already logged in'
      });
    }
    this.credentials = credentials;
    this.url = url;
    try {
      this.ws = new $WebSocket(url);
    } catch (err) {
      throw err;
    }

    // split incomming stream in answers and events
    [this.answers, this.events] = this.ws.getDataStream()
      .map((val: MessageEvent) => JSON.parse(val.data))
      .partition(val => val.type === 'answer');

    // Register Answerhandler which resolves/rejects promises
    this.answers.subscribe((ans: Answer) => {
      if (ans.id in this.callbacks) {
        this.callbacks[ans.id](ans);
        delete (this.callbacks[ans.id]);
      }
      if (ans.error === 0 && ans.subtype === 'apilogin') {
        this.credentials = {
          username: null,
          password: null,
          token: ans.data.token
        };
      }
    });

    return this.request('apilogin', this.credentials);
  }

  /**
   * Creates a Request
   * 
   * @param subtype {string} type of the request (eg: writeconfig)
   * @param data {any} data to send (eg config file)
   * @returns {Promise} resolving the data on receive
   */
  public request(subtype: string, data: any): Promise<any> {
    let id = ++this.id;
    let req: Request = {
      type: 'request',
      subtype: subtype,
      id: id,
      data: data
    };

    this.ws.send(req)
      .then(noop, a => console.log('Error: ', a));

    return new Promise<any>((resolve, reject) => {
      this.callbacks[id] = (ans: Answer) => {
        if (ans.error === 0) {
          resolve(ans.data);
        } else {
          reject({
            errno: ans.error,
            message: ans.errormessage
          });
        }
      };
    });
  }

  /**
   * Let's you subscribe to a server event.
   * 
   * @param event {string} the event on which to subscribe
   * @param callback {{ (data: any): void }} Callback which gets passed the received data
   * 
   * @returns {Subscription} which can be used to unsubscribe
   */
  public subscribeEvent(event: string, callback: { (data: any): void }): Subscription {
    event = event.toLowerCase();
    if (this.requestedEvents.indexOf(event) < 0) {
      this.request('subscribeevent', { name: event })
        .then((_) => this.requestedEvents.push(event),
        (err: Err) => {
          throw new Error(`Error (${err.errno}): ${err.message}`);
        });
    }
    if (!(event in this.eventtypes)) {
      this.eventtypes[event] = this.events.filter(ans => ans.subtype === event);
    }
    return this.eventtypes[event].subscribe(callback);
  }


}

