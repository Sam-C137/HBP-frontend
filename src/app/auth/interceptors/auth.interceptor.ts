import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { TokenService } from "@services/state";

export const authInterceptor: HttpInterceptorFn = (request, next) => {
    if (request.headers.has("Skip-Interceptor")) {
        const clonedReq = request.clone({
            headers: request.headers.delete("Skip-Interceptor"),
        });
        return next(clonedReq);
    }

    const tokenService = inject(TokenService);
    const token = tokenService.get();
    if (token) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    return next(request);
};
