/*index负责向外暴露外面需要调用的reducer和action */
import reducer from './reducer'
import * as actionCreators from './actionCreators'

export { reducer, actionCreators };