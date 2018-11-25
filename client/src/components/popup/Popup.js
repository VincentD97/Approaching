import React, { Component } from 'react';
import '../../css/Popup.css';
import Row from './Row';
import Icon from './Icon';
import config from '../../config';
import {connect} from 'react-redux';
import  * as actions from '../../actions';



/**
 * @classdesc Construct a Popup component that renders given data object. 
 */
class Popup extends Component {
    /**
     * Currently we manually construct datas for popup to display since we do not have communication with others.
     * Initialize the state variables with corresponding input data.
     * (TO BE DONE) Communication with other front-end components and server.
	 * @constructor 
	 * @param {None}
	 * @return {void} 
	 */
    constructor(props){
        super(props);

        const { isAdd, id } = this.props.payload;
        if (isAdd) {
            this.state = {
                editing: true,
                payload: {}
            };
        } else {
            const payload = this.props.events.filter(event => event._id === id)[0];
            this.state = {
                editing: false,
                payload: payload
            };
        }
        
        
    }

    /**
	 * This method flips the current editing state.
	 * either from editing to not-editing, or vice versa.
     * 
	 * @param {None}
	 * @return {void} 
	 *
	 */
    changeEditingState(){
        this.setState({
            editing: !this.state.editing
        });
    }

     /**
	 * This method set the value of name to the new input value.
	 * 
	 * @param {JsonObject} event a specific event that invokes this method, e.g. editing the iput form
	 * @return {void} 
	 */
    handleChange(event) {
        const payload = this.state.payload;
        payload.name = event.target.value;
        this.setState({
            payload: payload
        })
    }

    /**
	 * This method invokes the changeEditingState() on clicking of submit button.
     * In the future it will send the changed data to server and reducer.
	 * 
	 * @param {None}
	 * @return {void}
	 */
    handleSubmit() {
        this.changeEditingState();
        /**
         * if this.props.payload.isAdd === true, send an insert item/event 
         * request to server.
         */
        /**
         * if this.props.payload.isAdd === false, send an update item/event 
         * request to server.
         */
        
        if (this.props.payload.isAdd === true) {
            console.log("tttt", this.state.payload);
            this.props.insertEvent(this.state.payload,'test','test');
            this.props.fetchEvents('test','test');
            this.props.togglePopup();
        }
        else{

        }
    }

    /**
	 * This method set the value of each key to the new given value.
	 * 
	 * @param {String} key a specific event that invokes this method, e.g. editing the iput form.
	 * @param {String} value the given new value.
     * @return {void} 
	 */
    handleEditResult(key, value) {
        const payload = this.state.payload;
        payload[key] = value;
        this.setState({
            payload: payload
        })
    }


    /**
	 * Render the popup based on input data type and value. 
     * 
	 * @param {none}
     * @return {html} Returns a html block of Popup component. 
	 */
    render() {
        const { payload } = this.state;
        console.log("---------", this.state.payload.description, payload);
        return (
            <div className='popup'>
                <div className='popup_inner'>
                    <div className='top'>
                        <span>
                            <Icon iconName='times' onClick={() => this.props.togglePopup()} />
                            { this.state.editing ? 
                                (<input className='title' 
                                        type="text"
                                        value={payload.name} 
                                        placeholder="Input item name here"
                                        onChange={this.handleChange.bind(this)} />) : 
                                (<div className='title'>{payload.name}</div>)
                            }
                        </span>
                    </div>
                    <div className='middle'>
                        { config.fields[this.props.payload.contentType].map(key => (
                            <Row key={key} 
                                field={key}
                                iconName={config.icons[key]}
                                details={payload[key]}
                                editing={this.state.editing}
                                handleEditResult={this.handleEditResult.bind(this)} />
                        ))}
                    </div>
                    <div className='bottom'>
                        <div className='left'>
                            { this.state.editing ? 
                                (<Icon iconName='save' onClick={this.handleSubmit.bind(this)} />) : 
                                (<Icon iconName='pen' onClick={this.changeEditingState.bind(this)}/>)
                            }
                        </div>
                        <div className='right'>
                            <Icon iconName='trash-alt' />
                        </div>
                    </div>
                </div>
            </div>
        ); 
    }
}

function mapStateToProps(state){
    return {
        user: state.auth,
        payload: state.popup.payload,
        events: state.events.rawEvents
    }
}

export default connect(mapStateToProps, actions)(Popup);
