import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton,AtInput, AtForm,AtList, AtListItem  } from 'taro-ui'
import { fetchPoetry } from '../../actions'
import './index.scss'

@connect( state => ({
  poetry:state.get('poetry').toJS()
}), (dispatch) => ({
  fetchPoetry () {
    dispatch(fetchPoetry())
  }
}))

class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const {poetry} = this.props

    return (
      <View className='index'>
        <AtButton className='dec_btn' onClick={this.props.fetchPoetry} loading={poetry.fetching}>fetchPoetry</AtButton>
        <AtList>
            {poetry && poetry.data.map(v=><AtListItem title={`标题:${v.poetry_title}`} note={`作者:${v.author}`} arrow='right' key={v.author+Math.random()} />)}
      </AtList>
      </View>
    )
  }
}

export default Index
