import home from '../assets/icons/home.png'
import user from '../assets/icons/user.png'
import profile from '../assets/icons/profile.png'
import setting from '../assets/icons/setting.png'
import logout from '../assets/icons/logout.png'
import product from '../assets/icons/product.png'
import category from '../assets/icons/category.webp'
import cart from '../assets/icons/cart.webp'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const menuItems = [
  {
    title: 'MENU',
    items: [
      {
        icon: home,
        label: 'Home',
        href: '/admin'
      },
      {
        icon: user,
        label: 'Users',
        href: '/admin/users'
      },
      {
        icon: product,
        label: 'Products',
        href: '/admin/products'
      },
      {
        icon: category,
        label: 'Categories',
        href: '/admin/categories'
      },
      {
        icon: cart,
        label: 'Orders',
        href: '/admin/orders'
      }
    ]
  },
  {
    title: 'OTHER',
    items: [
      {
        icon: profile,
        label: 'Profile',
        href: '/profile'
      },
      {
        icon: setting,
        label: 'Settings',
        href: '/settings'
      },
      {
        icon: logout,
        label: 'Logout',
        href: '/logout'
      }
    ]
  }
]

const Menu = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className='mt-4 text-sm dark:text-white'>
      {menuItems.map((i) => (
        <div className='flex flex-col gap-2' key={i.title}>
          <span className='hidden lg:block text-gray-400 font-light my-4'>{i.title}</span>
          {i.items.map((item) => {
            if (item.label === 'Logout') {
              return (
                <button
                  key={item.label}
                  className='flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight'
                  onClick={handleLogout}
                >
                  <img src={item.icon} alt='' width={20} height={20} />
                  <span className='hidden lg:block'>{item.label}</span>
                </button>
              )
            }

            return (
              <Link
                to={item.href}
                key={item.label}
                className='flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight'
              >
                <img src={item.icon} alt='' width={20} height={20} />
                <span className='hidden lg:block'>{item.label}</span>
              </Link>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default Menu
