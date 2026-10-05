import { CircleUserRound} from 'lucide-react';
import {useState, useRef, useEffect, useMemo} from 'react';
import {useRouter} from "next/navigation";
import {checkPermissions} from "@/utils/check-permissions";

interface Props {
    name: string,
    handleLogout: () => void
}

const ProfileDropdown = ({
                             name,
                             handleLogout
                         }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter()


    // Toggle dropdown open/close
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Close dropdown if clicked outside
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const onclick = (path) => {
        router.replace(path)
            // router.push(path);
    }

    const iconSize = useMemo(() => window.innerWidth >= 768 ? 15 : 30, []);


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 focus:outline-none text-header-text"
            >
                <div className="flex flex-col items-center">
                    <CircleUserRound size={15} className="hidden md:block" />
                    <CircleUserRound size={30} className="md:hidden" />
                    <span className="text-xs hidden md:block font-medium">{name}</span>
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card-bg text-foreground border border-card-border-light rounded-md shadow-lg py-2 z-20">
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted-bg"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
