/* eslint-disable */
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild,
    effect,
    inject,
    input,
    model,
} from "@angular/core";
import { Chat, Contact, Message } from "../contact/contact.types";
import { InputComponent } from "@shared/inputs/input/input.component";
import { RxStompService } from "@/app/services/api/rx-stomp.service";
import { FormControl, FormsModule } from "@angular/forms";
import { UserService } from "@/app/services/state";
import { UserAvatarComponent } from "@/app/shared/avatars/user-avatar/user-avatar.component";
import {
    injectQuery,
    injectQueryClient,
} from "@tanstack/angular-query-experimental";
import { BarsComponent } from "@/app/shared/loaders/bars/bars.component";
import { transformChatData } from "@/app/utils";
import { DatePipe, KeyValue, KeyValuePipe } from "@angular/common";

@Component({
    selector: "hbp-chat-section",
    standalone: true,
    imports: [
        InputComponent,
        FormsModule,
        UserAvatarComponent,
        BarsComponent,
        KeyValuePipe,
        DatePipe,
    ],
    templateUrl: "./chat-section.component.html",
    styleUrl: "./chat-section.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatSectionComponent {
    @ViewChild("messageContainer") messageContainer!: ElementRef;
    queryClient = injectQueryClient();
    #chatService = inject(RxStompService);
    userService = inject(UserService);
    selectedContact = model<Contact | undefined>();
    contacts = input.required<Contact[] | undefined>();

    message = new FormControl("", { nonNullable: true });
    chatHistoryQuery = injectQuery(() => {
        return {
            queryKey: ["chat-history", this.selectedContact()?.conversationId],
            queryFn: () =>
                this.#chatService.getChatHistory({
                    conversationId: this.selectedContact()!.conversationId,
                    userId: this.userService.user!.id,
                }),
        };
    });

    constructor() {
        effect(() => {
            if (this.selectedContact() && this.messageContainer) {
                this.scrollDown();
            }
        });

        effect(
            () => {
                if (this.chatHistoryQuery.data()) {
                    this.selectedContact.update((contact) => {
                        const queryData = this.chatHistoryQuery.data() || [];
                        const messagesWithTimeGroups =
                            transformChatData(queryData);
                        if (contact) {
                            return {
                                ...contact,
                                messages: messagesWithTimeGroups,
                            };
                        }
                        return contact;
                    });
                }
            },
            { allowSignalWrites: true },
        );
        this.selectedContact.update((contact) => {
            if (contact) {
                return {
                    ...contact,
                    messages: this.queryClient.getQueryData([
                        "chat-history",
                        this.selectedContact()?.conversationId,
                    ])!,
                };
            }
            return contact;
        });
    }

    sendMessage() {
        setTimeout(() => {
            this.scrollDown();
        }, 0);
        if (this.message.value) {
            this.selectedContact.update((contact) => {
                if (contact) {
                    return {
                        ...contact,
                        loading: true,
                    };
                }
                return contact;
            });
            const payload: Chat = {
                content: this.message.value,
                recipientId:
                    this.selectedContact()?.doctorsId ===
                    this.userService.user?.id
                        ? this.selectedContact()?.patientsId!
                        : this.selectedContact()?.doctorsId!,
                senderId: this.userService.user?.id!,
                conversationId: this.selectedContact()?.conversationId!,
            };
            this.#chatService.publish({
                destination: "/app/chat.send",
                body: JSON.stringify(payload),
            });
            this.message.reset();
        }
    }

    scrollDown() {
        this.messageContainer.nativeElement.scrollTop =
            this.messageContainer.nativeElement.scrollHeight;
    }

    /*Preserve order of Map*/
    originalOrder = () => 0;

    isLongBack(date: string) {
        const today = new Date().getDate();
        const messageTime = new Date(date).getDate();

        return today - messageTime >= 7;
    }
}
