import { LogoutOutlined } from '@ant-design/icons'
import avatar from '../assets/icons/avatar.png'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const NavbarAdmin = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className='flex items-center justify-between p-4 dark:bg-dark dark:text-white'>
      <div className='flex items-center gap-3 justify-end w-full'>
        <div className='flex flex-col'>
          <span className='text-sm leading-3 font-medium'>Admin</span>
          <span className='text-[10px] text-gray-500 text-right'>Online</span>
        </div>
        <img src={avatar} alt='' width={36} height={36} className='rounded-full' />
        <LogoutOutlined className="cursor-pointer transition hover:translate-x-0.5" onClick={handleLogout} />
      </div>
    </div>
  )
}

export default NavbarAdmin
