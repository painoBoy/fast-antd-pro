import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from './authority';

let Authorized = RenderAuthorized(getAuthority()); // eslint-disable-line

// Reload the rights component 重新加载权限文件
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority());
};

export { reloadAuthorized };
export default Authorized;
