/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { type ConfirmationDetails } from "@app/components/ui/modals/confirmation-modal/confirmation-modal.service";
import { HBConfirmableActions } from "@models";

/**
 * @description Shows a confirmation popup before executing the method
 * cancels the action if the user cancels the confirmation, continues otherwise
 *
 * @example
 * ```ts
 * export class HomePage {
 *  @Confirm({
 *      title: 'Are you sure?',
 *      submit: 'Yes, delete',
 *      cancel: 'No, cancel'
 *  })
 *  delete() {
 *     console.log('Deleted');
 *  }
 *
 * }
 * ```
 * The modal content can be customized by creating a template ref with the name #modalTemplate
 * and extending HBConfirmableActions. Without extending HBConfirmableActions, you can have similar
 * functionality by injecting the modalService, viewContainerRef and querying for modalTemplate with viewChild
 * in the component.
 */

export function Confirm(details: ConfirmationDetails = {}) {
    return function (
        target: HBConfirmableActions,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: unknown[]) {
            const {
                modalService,
                modalTemplate,
                viewContainerRef,
                modalLoading,
            } = this;
            const ref = modalService.open(
                viewContainerRef,
                modalTemplate,
                details,
                modalLoading,
            );
            ref.changeDetectorRef.detectChanges();
            ref.instance.cancelEvent.subscribe(() => {
                return null;
            });
            ref.instance.confirmEvent.subscribe(() => {
                return originalMethod.apply(this, args);
            });
        };

        return descriptor;
    };
}
