import { DropdownActions } from "@utils";
import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
    output,
} from "@angular/core";
import { SpinnerComponent } from "@shared/loaders/spinner/spinner.component";
import { UserAvatarComponent } from "@shared/avatars/user-avatar/user-avatar.component";
import { ServiceAvatarComponent } from "@shared/avatars/service-avatar/service-avatar.component";
import { CrudActions } from "@types";
import { CommonModule } from "@angular/common";
import { Cache } from "@utils";

@Component({
    selector: "hbp-crud-table",
    standalone: true,
    imports: [
        UserAvatarComponent,
        ServiceAvatarComponent,
        SpinnerComponent,
        CommonModule,
    ],
    templateUrl: "./crud-table.component.html",
    styleUrls: [
        "./crud-table.component.scss",
        "../../../libs//stylesheets/tables.styles.scss",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrudTableComponent<
    T extends {
        status?: "ACTIVE" | "INACTIVE";
        colorCode?: string;
    },
> {
    protected readonly CrudActions = CrudActions;
    dropdownActions = new DropdownActions({ top: 20, left: -150 });
    actions = model<CrudActions>(CrudActions.Deactivate);
    listName = input.required<string>();
    headers = input.required<string[]>();
    loading = input<boolean>();
    items = input.required<({ image: string; name: string } & T)[], T[]>({
        transform: (items) => {
            return items.map((item) => {
                const imageKey = Object.keys(item).find((key) =>
                    this.hasImageKey(key as keyof T),
                );
                const nameKey = Object.keys(item).find((key) =>
                    this.hasNameKey(key as keyof T),
                );
                return {
                    image: item[imageKey as keyof T] as string,
                    name: item[nameKey as keyof T] as string,
                    ...item,
                };
            });
        },
    });
    keys = input.required<(keyof T)[]>();

    deactivate = output<void>();
    activate = output<void>();
    delete = output<void>();
    edit = output<void>();
    archive = output<void>();

    selectedItem = model<T>();

    @Cache
    hasNameKey(key: keyof T) {
        const regex = /^(full[-]?name|name|service[-]?name)$/i;
        return typeof key === "string" && regex.test(key);
    }

    @Cache
    hasImageKey(key: keyof T) {
        const imageRegex =
            /^(profile[-]?picture|picture|image|icon|imageUrl)$/i;
        return typeof key === "string" && imageRegex.test(key);
    }
}
