import Pie from '../components/general-chart/Pie';

const PieDemo = ({}) => {

  const pieProps = {
    title: '某站点用户访问来源',
    series: [
        {
            name:'访问来源',
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        },
    ]
  }

  return (
    <div>
      <Pie {...pieProps}/>
    </div>
  )
}

export default PieDemo
