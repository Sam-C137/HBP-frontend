import { ApplicationConfig } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "@interceptors";
import {
    InMemoryScrollingFeature,
    InMemoryScrollingOptions,
    provideRouter,
    withInMemoryScrolling,
} from "@angular/router";
import { routes } from "./app.routes";
import {
    provideAngularQuery,
    QueryClient,
} from "@tanstack/angular-query-experimental";
import { rxStompServiceFactory } from "./rx-stomp.factory";
import { RxStompService } from "./services/api/rx-stomp.service";

const scrollConfig: InMemoryScrollingOptions = {
    scrollPositionRestoration: "top",
    anchorScrolling: "enabled",
};
const scrollingFeature: InMemoryScrollingFeature =
    withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideRouter(routes, scrollingFeature),
        provideAngularQuery(
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        staleTime: 1000 * 60,
                    },
                },
            }),
        ),
        {
            provide: RxStompService,
            useFactory: rxStompServiceFactory,
        },
    ],
};
