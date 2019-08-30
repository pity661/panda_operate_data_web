import lazyLoading from './lazyLoading'
export default (routers,data) => {
  //这里之所以要重新遍历一下，是因为，通常我们动态路由的时候，是获取服务端数据，这个component属性是一个字符串，或者可能连字段名都是其他的key
  //所以这里要做一些转换
  generaMenu(routers,data)
}
function generaMenu(routers,data){
  console.log(data)
  if (data === undefined || data == null) {
    return;
  }
  // for (var obj in data) {
  //   console.log(obj)
  //    let menu = Object.assign({},obj)
  //    menu.component = lazyLoading(menu.component)
  //    if(data.leaf){
  //       menu.children = []
  //       generaMenu(menu.children,obj.children)
  //     }
  //     routers.push(menu)
  //     console.log(routers)
  // }
  data.forEach((item)=>{
    let menu = Object.assign({},item)
    console.log("before")
    console.log(menu.component)
    menu.component = lazyLoading(menu.component)
    console.log("after")
    console.log(menu.component)
    if(!item.leaf){
      menu.children = []
      generaMenu(menu.children,item.children)
    }
    routers.push(menu)
  })
  console.log("*********")
  console.log(routers)
}