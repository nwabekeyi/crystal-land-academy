import Instructors from './instructor';
import Admin from './admin';
import { useSelector } from 'react-redux';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';


const TimeTable = () => {
const userRole = useSelector((state) => state.users.user.role);
console.log(userRole);


  // Render based on user role
  return (
    <div>
      {userRole === 'instructor' ? <Instructors /> : <Admin />}
    </div>
  );
};

export default withDashboardWrapper(TimeTable) ;
