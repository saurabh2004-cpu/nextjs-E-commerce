'use client';
import { useEffect, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import Addressform from './Addressform';
import axiosInstance from '@/app/(frontend)/services/api';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

interface Address {
    _id: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    createdAt: string;
    updatedAt: string;
    user: string;
    __v: number;
}

const AddressCard = () => {
    const [showAddressform, setShowAddressform] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [activeMenu, setActiveMenu] = useState<string | null>(null); // Track which menu is open
    const [addressData ,setAddressData]=useState({})
    const [loading ,setLoading] = useState(false)
    const router=useRouter()

    useEffect(() => {
        const fetchAddresses = async () => {
            setLoading(true)
            try {
                const response = await axiosInstance.get(`/api/get-address`);

                if (!response) {
                    console.error("Error fetching the address");
                }

                console.log(response.data.data);
                setAddresses(response.data.data);
            } catch (error) {
                console.error("Error while fetching addresses", error);
            }finally{
                setLoading(false)
            }
        };

        fetchAddresses();
    }, []);

    const handleMenuToggle = (id: string) => {
        setActiveMenu(activeMenu === id ? null : id);
    };

    const handleEdit = async(address: Address) => {
        console.log("Edit address with ID:", address);
        setShowAddressform(true)
        setAddressData(address)
    };

    const handleDelete = async (id: string) => {
        console.log("Delete address with ID:", id);
        try {
            const response = await axiosInstance.delete(`/api/delete-address?addressId=${id}`);
    
            if (!response) {
                console.error("Error: Address did not delete");
                toast({ description: "Error: Could not delete address", variant: "destructive" });
                return;
            }
            
            toast({ description: "Address deleted successfully" });
            setAddresses(addresses.filter(address => address._id !== id));
            router.refresh()
        } catch (error) {
            console.error("Error deleting address", error);
            toast({ description: "Error: Could not delete address", variant: "destructive" });
        }
    };

    const handleCloseForm = () => {
        setShowAddressform(false);
        setAddressData('');
        
    };
    
    const handleSave = (savedAddress: Address) => {
        if (addressData._id) {
            setAddresses(addresses.map(address => address._id === savedAddress._id ? savedAddress : address));
        } else {
            setAddresses([...addresses, savedAddress]);
        }
        handleCloseForm();
    };

    if(loading) return <p>Loading...</p>

    return (
        <div className="p-6 w-full">
            <h2 className="text-2xl font-semibold mb-4">Manage Addresses</h2>
            <button className="flex items-center text-blue-600 font-semibold mb-6" onClick={() => setShowAddressform(true)}>
                <span className="mr-2 text-xl">+</span>
                ADD A NEW ADDRESS
            </button>

            {showAddressform && <Addressform addressData={addressData}  onClose={handleCloseForm} onSave={handleSave}/>}

            {showAddressform && (
                <button className="flex items-center text-blue-600 font-semibold mb-6" onClick={() => setShowAddressform(false)}>
                    Cancel
                </button>
            )}

            {addresses.map((address) => (
                <div key={address._id} className="border rounded-lg p-4 flex justify-between items-start mb-4 relative">
                    <div>
                        <span className="inline-block bg-gray-200 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                            {address.addressLine1}, {address.postalCode}
                        </span>
                        <h3 className="text-gray-700">{address.addressLine2}</h3>
                        <p className="text-gray-700">City: {address.city}</p>
                        <p className="text-gray-700">State: {address.state}</p>
                        <p className="text-gray-700">Country: {address.country}</p>
                    </div>
                    <MoreVertical
                        className="w-6 h-6 text-gray-500 cursor-pointer"
                        onMouseEnter={() => handleMenuToggle(address._id)}
                    />
                    {activeMenu === address._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg" onMouseLeave={() => handleMenuToggle('')}>
                            <button
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                onClick={() => handleEdit(address)}
                                
                            >
                                Edit
                            </button>
                            <button
                                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                                onClick={() => handleDelete(address._id)}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AddressCard;
