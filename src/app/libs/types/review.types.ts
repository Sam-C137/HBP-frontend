export type Review = {
    reviewer: string;
    rating: number;
    review: string;
    createdDate: Date;
    reviewerProfileImage: string;
    id: number;
    doctor: string;
    doctorProfileImage: string;
};

export type Summary = {
    numberOfReviews: number;
    numberOfOneStarReviews: number;
    numberOfTwoStarReviews: number;
    numberOfThreeStarReviews: number;
    numberOfFourStarReviews: number;
    numberOfFiveStarReviews: number;
    rating: number;
};

export type PostReviewDetails = {
    doctorId: string;
    rating: number;
    review: string;
};
