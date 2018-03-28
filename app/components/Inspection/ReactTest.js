import React from "react"

const ReactTest = ({}) => (
	<div
		style={{
			position       : "absolute",
			top            : 0,
			left           : 0,
			width          : "50%",
			height         : "50%",
			fontSize       : 100,
			backgroundColor: "red",
			zIndex: 1000
		}}
	>
		React TEST
	</div>
)

ReactTest.propTypes = {}

ReactTest.defaultProps = {}

export default ReactTest
