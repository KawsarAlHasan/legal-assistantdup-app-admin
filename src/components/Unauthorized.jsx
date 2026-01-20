import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const Navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen">
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button
            onClick={() => Navigate("/login")}
            type="primary"
            className="my-main-button"
          >
            Back Home
          </Button>
        }
      />
    </div>
  );
}

export default Unauthorized;
