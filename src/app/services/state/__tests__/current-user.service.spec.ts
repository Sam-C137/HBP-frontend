import { TestBed } from "@angular/core/testing";
import { UserService } from "../current-user.service";
import { mockDoctorList } from "@/app/utils/mockdata";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("UserService", () => {
    let service: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UserService],
        }).compileComponents();

        service = TestBed.inject(UserService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should be able to keep user details", () => {
        service.user = mockDoctorList[0];

        expect(service.user).toEqual(mockDoctorList[0]);
    });
});
