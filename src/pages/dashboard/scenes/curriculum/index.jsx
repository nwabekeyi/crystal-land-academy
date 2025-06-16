import Instructors from "../academicYear/instructor";
import withDashboardWrapper from "../../../../components/dasboardPagesContainer";

const Curriculum = () => {


  return (
    <div>
      <Instructors />
    </div>
  );
};

export default withDashboardWrapper(Curriculum);
