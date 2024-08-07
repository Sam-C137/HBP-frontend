import { User } from "@app/libs/types/main.types";

export type AdminDashBoardData = {
    numberOfNewUsers: number;
    numberOfDoctors: number;
    numberOfPatients: number;
    totalNumberOfUsers: number;
    newInvitedDoctors: (Partial<User> & {
        dateInvited: string;
    })[];
    newUsers: (Partial<User> & {
        dateInvited: string;
    })[];
};
