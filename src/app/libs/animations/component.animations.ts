import {
    trigger,
    state,
    style,
    animate,
    transition,
    query,
    stagger,
} from "@angular/animations";

export const float = trigger("float", [
    state(
        "open",
        style({
            opacity: 1,
            transform: "translateY(0)",
        }),
    ),
    state(
        "closed",
        style({
            opacity: 0,
            transform: "translateY(-0.5rem)",
        }),
    ),
    transition("closed => open", [animate("0.1s")]),
    transition("open => closed", [animate("0.1s")]),
]);

export const popup = trigger("popup", [
    transition(":enter", [
        style({ opacity: 0, transform: "scale(0.9)" }),
        animate("0.2s", style({ opacity: 1, transform: "scale(1)" })),
    ]),
    transition(":leave", [
        animate("0.2s", style({ opacity: 0, transform: "scale(0.8)" })),
    ]),
]);

const visible = { transform: "translateX(0)" };
const hidden = { transform: "translateX(-120%)" };
const animation = ".5s ease-in";

export const slidingSidebar = trigger("openClose", [
    transition(":enter", [style(hidden), animate(animation, style(visible))]),
    transition(":leave", [style(visible), animate(animation, style(hidden))]),
]);

export const overlayFadeIn = trigger("fadeIn", [
    transition(":enter", [
        style({ opacity: 0 }),
        animate(".5s 100ms ease-in", style({ opacity: 0.7 })),
    ]),
    transition(":leave", [
        style({ opacity: 0.7 }),
        animate(".3s 100ms ease-in", style({ opacity: 0 })),
    ]),
]);

export const slideUpDelayed = trigger("slideUpDelayed", [
    transition(":enter", [
        style({ opacity: 0, transform: "translateY(25%)" }),
        animate(
            ".3s .2s ease-in",
            style({ opacity: 1, transform: "translateY(0)" }),
        ),
    ]),
]);

export const listStagger = trigger("reviewStagger", [
    transition("* <=> *", [
        query(
            ":enter",
            [
                style({ opacity: 0 }),
                stagger(200, [animate("500ms ease-in", style({ opacity: 1 }))]),
            ],
            { optional: true },
        ),
    ]),
]);
