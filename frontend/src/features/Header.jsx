import {Container, CustomNavLink, CustomNavLinkList, ProfileCard} from "@/components/index.js";
import {useEffect, useState} from "react";
import menuList from "@/constants/menu-list.js";
import {useUser} from "@/contexts/UserContext.jsx";
import {IoSearchOutline} from "react-icons/io5";
import NotificationBell from "@/components/NotificationBell.jsx";
import {IoIosArrowDropdown} from "react-icons/io";
import {useLocation} from "react-router";

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isChatPage = location.pathname === "/chat";

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { avatarUrl, user } = useUser();

  const toggleDropdown = () => {setIsDropdownOpen((isDropdownOpen) => !isDropdownOpen)};
  const handleScroll = () => {setIsScrolled(window.scrollY > 0)};

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={
        isHomePage ? `header py-1 bg-primary ${isScrolled ? "scrolled" : ""}`
        : (isChatPage ? "header py-1 bg-primary" : `header bg-white shadow-s1 ${isScrolled ? "scrolled" : ""}`)
      }
    >
      <Container>
        <nav className="p-4 flex justify-between items-center relative">
          {/*Logo*/}
          <div>
            {(isHomePage || isChatPage) && !isScrolled ? (
              <img src="../../public/header-logo.png" alt="LogoImg" className="h-11" />
            ) : (
              <img src="../../public/header-logo2.png" alt="LogoImg" className="h-11" />
            )}
          </div>

          {/*Login as Admin and Seller role*/}
          <div className="hidden lg:flex items-center justify-between gap-8">
            {menuList.map((menu) => (
              (menu.id !== 7 || user?.role === "SELLER") &&
              (menu.id !== 8 || user?.role === "ADMIN") &&
              (
                <li key={menu.id} className="capitalize list-none">
                  <CustomNavLinkList href={menu.path} isActive={location.pathname === menu.path} className={`${isScrolled || (!isHomePage && !isChatPage) ? "text-black" : "text-white"}`}>
                    {menu.link}
                  </CustomNavLinkList>
                </li>
              )
            ))}
          </div>

          <div className="flex items-center gap-8 icons">
            <div className="hidden lg:flex lg:items-center lg:gap-8">
              <IoSearchOutline size={23} className={`${isScrolled || !isHomePage ? "text-black" : "text-white"}`} />

              {/*Login as Bidder*/}
              {user?.role === "BIDDER" && (
                <CustomNavLink href="/seller/login" className={`${isScrolled || !isHomePage ? "text-black" : "text-white"}`}>
                  Become a Seller
                </CustomNavLink>
              )}

              {!user.role ? (
                // Logout
                <div className="flex items-center gap-8">
                  <CustomNavLink href="/auth/login" className={`${isScrolled || !isHomePage ? "text-black" : "text-white"}`}>
                    Sign in
                  </CustomNavLink>
                  <CustomNavLink href="/auth/register" className={`${!isHomePage || isScrolled ? "bg-green" : "bg-white"} px-8 py-2 rounded-full text-primary shadow-md`}>
                    Join
                  </CustomNavLink>
                </div>
              ) : (
                // Login
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-4">
                    <NotificationBell />
                  </div>
                  <div className="relative">
                    <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
                      <ProfileCard>
                        <img src={avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                        <IoIosArrowDropdown
                          size={17}
                          className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors text-emeral-700"
                        />
                      </ProfileCard>
                    </button>

                    {/*Menu when click in avatar*/}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                        <div> {/*Handle click*/}
                          <CustomNavLink href="/account" className="block px-4 py-2 text-black hover:bg-gray-200">
                            Account
                          </CustomNavLink>
                        </div>
                        <div> {/*Handle click*/}
                          <CustomNavLink href="/auth/change-password" className="block px-4 py-2 text-black hover:bg-gray-200">
                            Change Password
                          </CustomNavLink>
                        </div>
                        <button className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200 text-[17px] font-medium cursor-pointer list-none hover:text-green transition-all ease-in-out ">
                          Logout
                        </button> {/*Handle click*/}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
