'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axiosInstance from '@/app/(frontend)/services/api';
import { useRouter } from 'next/navigation';
import { useMutationState, useQuery } from '@tanstack/react-query';


interface User {
    _id: string,
    username: string
}

interface Review {
    _id: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    product: string;
    username: string;
    user: User
}

interface ListAllReviewsProps {
    productId: string;
    averageRating?: number; // optional
    totalReviews?: number;  // optional
}

const ListAllReviews: React.FC<ListAllReviewsProps> = ({
    productId,
    averageRating = 0,
    totalReviews = 0,
}) => {

    const [reviews, setReviews] = useState<Review[]>([]);
    const { data: session, status } = useSession();
    const user = session?.user;

    const pendingReview = useMutationState<string>({
        filters: { mutationKey: ['addReview'], status: 'pending' },
        select: (mutation) => mutation.state.variables as string,
    });

    // console.log("pending review",pendingReview); 


    const fetchReviews = async () => {
        const response = await axios.get(`/api/get-all-reviews?productId=${productId}`);
        // console.log("reviews", response.data.data);
        // setReviews(response.data.data);
        return response.data.data
    };

    const { isError, isLoading, data: reviewsData } = useQuery({
        queryKey: ['reviewsData'],
        queryFn: fetchReviews,
    })


    if (isError) return <p>Error : Getting Products Reviews</p>
    if (isLoading) return <p>Loading ...</p>

    // const handleDeleteReview = async (reviewId: string) => {
    //     try {
    //         const response = await axiosInstance.post(`/api/delete-review?reviewId=${reviewId}`)

    //         if (!response) {
    //             console.error("error deleting review")
    //         }
    //         setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
    //         console.log(response.data.data)
    //         router.refresh()

    //     } catch (error) {
    //         console.error("error while deleting the review")
    //     }
    // }

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            {/* Ratings Summary */}
            {totalReviews > 0 && (
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold">{averageRating.toFixed(1)} ★</h2>
                        <p className="text-gray-500">{totalReviews} Ratings & Reviews</p>
                    </div>
                </div>
            )}

            {/* pending review  */}
            {pendingReview &&  (
                <div className="mb-4 border-b border-gray-200 pb-4 flex justify-between items-start">
                    <div className="flex-grow">
                        <div className="flex items-center mb-2">
                            {/* <div className="flex items-center text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 opacity-50" />
                                ))}
                            </div> */}
                            {/* <p className="ml-2 text-sm text-gray-500">Pending...</p> */}
                        </div>
                        <p className="text-gray-700 mb-2 opacity-50">{pendingReview}</p>
                        <div className="flex items-center text-gray-500">
                            {/* <span className="text-sm">Pending...</span> */}
                        </div>
                    </div>
                </div>
            )}

            {/* Review Items */}

            {reviewsData && reviewsData.map((review: Review) => (
                <div key={review._id} className="mb-4 border-b border-gray-200 pb-4 flex justify-between items-start">
                    <div className="flex-grow">
                        <div className="flex items-center mb-2">
                            <div className="flex items-center text-yellow-500">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4" />
                                ))}
                            </div>
                            <p className="ml-2 text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>

                        {/* {pendingReview && <p className="text-gray-700 mb-2 opacity-40">{pendingReview}</p>} */}

                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <div className="flex items-center text-gray-500">
                            <span className="text-sm"> {review.user.username}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListAllReviews;
