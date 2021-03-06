import React,{Component} from 'react';
import Layer from './Layer';
import "../../assets/styles/Dashboard.css";
import "../../assets/styles/itemboard/Itemboard.css";
import config from '../../config';
import ls from 'local-storage';
import {connect} from 'react-redux';
import * as actions from '../../actions';

/**
 * Class representing the Item dashboard
 * @class
 */
class Itemboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            layerStack: [ this.props.structuredItems ],
            searchMode:false
        };
    }

    /**
     * @function
     * @param 
     * @return {void}
     * This function helps to change the events to the form of [{id:xxx,label:xxx}...]
     */

    componentDidMount(){
        //this.props.fetchItems('test','test');
        this.props.fetchItems(ls.get('facebookId'),ls.get('accessToken'));
    }

    /**
     * @function
     * @param {Object} nextProps
     * @return {void}
     * This function will help rerender the layer given the new props received 
     */
    componentWillReceiveProps(nextProps){
        if(nextProps.structuredItems !== this.props.structuredItems){
            this.setState({
                layerStack: [ nextProps.structuredItems ],
            });
        }
    }

    /**
     * @function
     * @param
     * @return {void}
     * This function will pop off the up layer and thus achieve the effect that the itemboard goes back to the previous layer
     */
    go_back(){
        if(this.state.layerStack.length > 1 ){
            this.setState(prevState => ({
                layerStack: prevState.layerStack.slice(0, -1)
            }));
        }
    }
    
    /** 
     * @param {JsonObject} l - The new layer that will be rendered
     * @returns {JsonObject} set the layer to the new layer passed in
    */
    changeLayer(l){
        this.setState(prevState => ({
            layerStack: prevState.layerStack.concat(l)
        }));
    }

    /**
     * to enter/leave the search mode
     * @return {void}
     */

    handleSearch(){
        this.setState((prevState) => {
            return {searchMode:!prevState.searchMode};
        });
    }

    /**
     * @return {void}
     * close the search results window
     */
    handleClose(){
        this.setState((prevState) => {
            return {searchMode:!prevState.searchMode};
        });
        document.getElementById("search").value="";
    }

    /**
     * change the JsonData to displayable string
     * @param {JsonObject} location
     * @return {string} return the parsed string
     */
    formatLocation(location){
        return JSON.parse(location).join(' / ');
    }

    /**
     * this function goes through all the items and check whehter it contains substring same as the input
     * If it does, it will be listed in the result
     * @return {html} the search results
     */

    renderSearchResult(){
        const input_item_name =  document.getElementById("search").value.toLowerCase();
       // const payload = this.props.rawItems.filter(item => item.name === input_item_name);
       const payload = this.props.rawItems.filter(item => item.name.toLowerCase().includes(input_item_name));
        if(payload.length === 0){
            return (
                <h3 className='no-item-found-prompt'>
                    No items found
                </h3>
            );
        }
        else {
            const entries = payload.map((item,idx) => {
                return (
                    <div 
                        className="search-result-entry"
                        onClick = {() => this.props.togglePopup({
                            contentType:'item',
                            isAdd:false,
                            id:payload[idx]._id
                        })}
                    >
                        <div className="search-result-item-name">{item.name}</div>
                        <div className="search-result-location">{this.formatLocation(item.location)}</div>
                    </div>
                );
            });
            return (
                <div className="top-layer" style={{overflowY:'scroll'}}>
                    {entries}
                </div>
            );
        }
    }


    /**
     * This function renders all the items layer by layer. When the user tries to search for
     * specific items, it will search through raw items to find if there are any matches
     * @param {Array[item]} rawItems - the items in an array
     * @param {Object} structuredItems - the items in an object of the form layer by layer
     * @return {html} the itemboard either in search mode or normal dispay mode
     */
    render() {
        const { layerStack } = this.state;
        const layerStackNames = [];
        layerStack.forEach(layer => layerStackNames.push(layer && layer.name));
        const length = layerStack.length;

        const baseLayer = length > 2 ? (
            <div
                className='layer base-layer'
                style={{
                    marginLeft: `${config.layerOffset.x}px`,
                    marginTop: `${config.layerOffset.y * 2}px`
                }}
            />
        ) : null;
        const secondLayerOffset = length > 2 ? { x: 0, y: config.layerOffset.y } : {
            x: config.layerOffset.x / 2,
            y: config.layerOffset.y
        }
        const secondLayer = length > 1 ? (
            <Layer
                className='second-layer'
                content={layerStack[length - 2]}
                changeLayer={this.changeLayer.bind(this)}
                goBack={this.go_back.bind(this)}
                offset={secondLayerOffset}
                enable={false}
            />
        ) : null;
        const topLayerOffset = (length === 1) ? { x: 0, y: 0 } : {
            x: config.layerOffset.x / (length === 2 ? -2 : -1),
            y: 0
        }
        const topLayer = (
            <Layer
                className='top-layer'
                content={layerStack[length - 1]}
                changeLayer={this.changeLayer.bind(this)}
                goBack={this.go_back.bind(this)}
                offset={topLayerOffset}
                enable={true}
                currentLocation={JSON.stringify(layerStackNames)}
            />
        );

        return (
            <div className="split-left left">
                <div className="searchbar">
                    <input id="search" type="text" placeholder="Search..."  className="searchbox"/>
                    {this.state.searchMode?  
                        <i className="fa fa-close iconSubmit" onClick={() => this.handleClose()}  ></i> :
                        <i className="fa fa-search iconSubmit" onClick={() => this.handleSearch()}  ></i>
                    }
                </div>

                <div className="showercase">
                    {this.state.searchMode ? this.renderSearchResult() : (
                        <div>
                            {baseLayer}
                            {secondLayer}
                            {topLayer}
                        </div>
                    )}
                </div>
                
                
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        structuredItems:state.items['structuredItems'],
        rawItems:state.items['rawItems']
    };
}


export default connect(mapStateToProps,actions)(Itemboard);