import { environment } from "@/environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { RxStomp } from "@stomp/rx-stomp";
import { lastValueFrom } from "rxjs";
import {
    Contact,
    HistoryPayload,
    Message,
} from "@/app/doctor/messages/contact/contact.types";

@Injectable({
    providedIn: "root",
})
export class RxStompService extends RxStomp {
    baseUrl = environment.baseUrl;
    #http = inject(HttpClient);
    #contacts = signal<Contact[] | undefined>(undefined);

    constructor() {
        super();
    }
    getChatHistory(payload: HistoryPayload) {
        return lastValueFrom(
            this.#http.get<Message[]>(
                `${this.baseUrl}/${payload.userId}/chats`,
                { params: { ...payload } },
            ),
        );
    }

    setContacts(contacts: Contact[] | undefined) {
        this.#contacts.set(contacts);
    }

    getContacts() {
        return this.#contacts();
    }

    updateContacts(modifiedContact: Contact) {
        this.#contacts.update((contacts) => {
            let filteredContacts: Contact[] = [];
            if (contacts) {
                filteredContacts = contacts.filter(
                    (contact) =>
                        contact.conversationId !==
                        modifiedContact.conversationId,
                );
            }
            return [modifiedContact, ...filteredContacts].sort(
                (a, b) =>
                    Date.parse(b.lastChat.timeStamp) -
                    Date.parse(a.lastChat.timeStamp),
            );
        });
    }
}
