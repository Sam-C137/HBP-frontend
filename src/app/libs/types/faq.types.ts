export type Faq = {
    id: number;
    question: string;
    answer: string;
    creationDate: string;
    modificationDate: string;
    state: "PUBLISHED" | "DRAFTED";
};
