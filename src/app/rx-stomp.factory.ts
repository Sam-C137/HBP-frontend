import { RxStompService } from "@services/api/rx-stomp.service";
import { hbpRxStompConfig } from "./rx-stomp.config";

export function rxStompServiceFactory() {
    const rxStomp = new RxStompService();
    rxStomp.configure(hbpRxStompConfig);
    return rxStomp;
}
