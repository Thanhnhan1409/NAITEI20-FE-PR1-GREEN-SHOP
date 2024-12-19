import { Spin } from 'antd';
import { useLoadingStore } from '../stores/loadingStore';

function LoadingCommon() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;
  return (
    <div className={`fixed inset-0 z-[99] bg-[#000] bg-opacity-40 flex items-center justify-center`} >
      <Spin size="large" />
    </div>
  )
}

export default LoadingCommon;
