import  "./ReturnHomeButton.css"
import { useNavigate } from "react-router-dom";

const ReturnHomeButton = () => {
	const navigate = useNavigate();

	const backHomeOnClick = () => {
		navigate("/");
	};

	return (
		<div className={"returnHomeButton"} onClick={backHomeOnClick}>
			Return Home
		</div>
	);
}

export default ReturnHomeButton