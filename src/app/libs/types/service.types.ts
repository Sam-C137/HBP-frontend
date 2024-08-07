export type Service = {
    id: number;
    name: string;
    numberOfDoctors: number;
    icon: string;
    iconName: string;
    description?: string;
    colorCode?: string;
    status: "ACTIVE" | "INACTIVE";
};

export type ServiceIcon = {
    id: number;
    name: string;
    iconData: string;
};
