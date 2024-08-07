import { User } from "./main.types";
import { Summary } from "./review.types";

export type Doctor = Readonly<{
    level: string;
    specialization: string;
    rating: number;
    about: string;
    title: string;
    yearsOfExperience: number;
    languages?: string;
    education: string;
    address: string | null;
    bio: string;
}> &
    User &
    Summary;
