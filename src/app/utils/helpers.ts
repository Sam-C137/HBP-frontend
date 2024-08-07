import { Message } from "../doctor/messages/contact/contact.types";
import { SystemGeneric } from "../libs/types";

export function randomHexColor() {
    let color = "#";
    for (let i = 0; i < 3; i++) {
        const part = Math.floor(Math.random() * 106 + 150).toString(16);
        color += part.length == 1 ? "0" + part : part;
    }
    return color;
}
export function removeFalsyValues<
    T extends {
        [key: string]: SystemGeneric;
    },
>(obj: T) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value) {
            acc[key as keyof T] = value;
        }
        return acc;
    }, {} as Partial<T>);
}

export function urlEncodeObject(obj: Record<string, SystemGeneric>) {
    return Object.entries(obj).reduce(
        (acc, [key, value]) => {
            acc[key as keyof typeof obj] = encodeURIComponent(value);
            return acc;
        },
        {} as Partial<typeof obj>,
    );
}

export function replaceSvgStroke(
    svgDataUri: string | undefined | null,
    newColor: string | undefined,
): string {
    if (!svgDataUri || !newColor) return "";
    const color = svgDataUri.match(/stroke='%23([0-9a-fA-F]{6})'/);
    if (!color) {
        throw new Error("Could not find the old color in the SVG data URI");
    }
    const oldColor = color[1];

    const newSvgDataUri = svgDataUri.replace(
        new RegExp(oldColor, "g"),
        newColor.slice(1),
    );

    return newSvgDataUri;
}

export function createMultipartForm<T extends object>(formObj: T): FormData {
    const formData = new FormData();
    Object.entries(formObj).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value);
        } else {
            formData.append(key, value.toString());
        }
    });
    return formData;
}

export function convertDateToIsoWithoutZ(date: Date | undefined): string {
    if (!date) return "";
    return date.toISOString().slice(0, -1);
}

export function findKey<T>(value: T, obj: Record<string, T>) {
    return Object.keys(obj).find((key) => obj[key] === value) || "";
}

export function getHostedFilePattern(fileFormats: string[]): RegExp {
    const formats = fileFormats.join("|");
    return new RegExp(`^https?:\\/\\/.*\\.(${formats})$`);
}

export function getDataUrlPattern(fileFormats: string[]): RegExp {
    const formats = fileFormats.join("|");
    return new RegExp(`^data:image\\/(${formats});base64,`);
}

export function extractChangedValues<T extends object>(
    original: T,
    current: T,
): Partial<T> {
    return Object.entries(current).reduce((acc, [key, value]) => {
        if (original[key as keyof T] !== value) {
            acc[key as keyof T] = value;
        }
        return acc;
    }, {} as Partial<T>);
}

export function transformChatData(queryData: Message[]) {
    const messagesWithTimeGroups: Map<string, Message[]> = queryData.reduce(
        (accumulator, currentValue) => {
            const newStampFormat = generateChatKey(currentValue.timeStamp);
            accumulator = addChat(accumulator, newStampFormat, currentValue);
            return accumulator;
        },
        new Map<string, Message[]>(),
    );
    return messagesWithTimeGroups;
}

export function generateChatKey(time: string) {
    const timeStamp = new Date(time);
    const date = timeStamp.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    let weekday = timeStamp.toLocaleDateString(undefined, {
        weekday: "long",
    });
    if (timeStamp.toLocaleDateString() === new Date().toLocaleDateString()) {
        weekday = "Today";
    }
    const newStampFormat = `${date.split(",").join(" ")},${weekday}`;
    return newStampFormat;
}

export function addChat(
    accumulator: Map<string, Message[]>,
    chatKey: string,
    value: Message,
) {
    if (!accumulator.has(chatKey)) {
        accumulator.set(chatKey, [value]);
    } else {
        accumulator.set(chatKey, [...accumulator.get(chatKey)!, value]);
    }
    return accumulator;
}
