/* @flow */
import React, { Component } from 'react';
import { ART, View, TouchableWithoutFeedback } from 'react-native';
const { Group, Surface } = ART;
import * as C from './constants';
import Wedge from './Wedge';

const getColor = (colors : Array<string>, index : number) => colors[index] || colors[colors.length % index];

export default class PieChart extends Component<void, any, any> {
	constructor(props : any) {
		super(props);
		this.state = { rotation: 0 };
		(this:any).boundingAreas = {};
	}

	shouldComponentUpdate(props : any) : boolean {
		return props.data.data !== this.props.data;
	}

	_handlePress(_e : Object) {
		// const { locationX, locationY } = e.nativeEvent;
	}

	render() {
		if (!this.props.width || !this.props.height) return <View />;

		const COLORS = this.props.data.sliceColors || [
			C.BLUE,
			C.GREY,
			C.RED,
			C.YELLOW,
			C.GREEN,
			C.DARK_PURPLE,
			C.LIGHT_PURPLE,
		];

		// TODO: Read stroke width from props?
		const STROKE_WIDTH = 1;
		const radius = (this.props.height / 2) - STROKE_WIDTH;

		const centerX = this.props.width / 2;
		const centerY = this.props.height / 2;

		// Gather sum of all data to determine angles
		let sum = 0;
		const data = this.props.data.data || [];
		data.forEach(n => { sum += (n > 0) ? n : 0.001; });
		const sectors = data.map(n => Math.ceil(360 * (n/sum)));
		let startAngle = 0;

		const arcs = [];
		const colors = [];
		sectors.forEach((sectionPiece, i) => {
			if (startAngle > 180) {
				startAngle = 180 - startAngle;
			}
			let endAngle = startAngle + sectionPiece;
			// TODO: fix angle calculation based on coords over 180
			if (endAngle > 180) {
				endAngle = 180 - endAngle;
			}
			arcs.push({ startAngle, endAngle, outerRadius: radius });
			colors.push(getColor(COLORS, i));
			// endAngle += startAngle;
			startAngle += sectionPiece;
		});
		return (
			<TouchableWithoutFeedback onPress={this._handlePress}>
				<View>
					<Surface width={this.props.width} height={this.props.height}>
						<Group originX={centerX} width={this.props.width} height={this.props.height} originY={centerY} rotation={this.state.rotation}>
							{arcs.map((arc, i) => {
								return (
									<Wedge
										stroke={colors[i]}
										strokeWidth={STROKE_WIDTH}
										fill={colors[i]}
										key={i}
										originX={centerX}
										originY={centerY}
										{ ...arc}
									/>
								);
							})}
						</Group>
					</Surface>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}
