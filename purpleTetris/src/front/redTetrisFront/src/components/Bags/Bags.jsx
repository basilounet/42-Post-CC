import  "./Bags.css"
import Tetrimino from "../Tetrimino/Tetrimino.jsx";

const   Bags = ({ bags }) => {
	if (!bags)
		return ;

	const   firstBag = bags[0];
	const   secondBag = bags[1];
	const   bagToPrint = firstBag.length >= 5 ? firstBag.slice(0, 5) : firstBag.concat(secondBag.slice(0, 5 - firstBag.length));

	return (
		<div className="bags">
			<div className="bagTitle">
				Bag
			</div>
			<div className="bagBody">
				<Tetrimino minoType={bagToPrint[0]?.name} minoSize={28} />
				<div className={"spaceHolder"}/>
				<Tetrimino minoType={bagToPrint[1]?.name} minoSize={28} />
				<div className={"spaceHolder"}/>
				<Tetrimino minoType={bagToPrint[2]?.name} minoSize={28} />
				<div className={"spaceHolder"}/>
				<Tetrimino minoType={bagToPrint[3]?.name} minoSize={28} />
				<div className={"spaceHolder"}/>
				<Tetrimino minoType={bagToPrint[4]?.name} minoSize={28} />
			</div>
		</div>
	)
}

export default Bags;