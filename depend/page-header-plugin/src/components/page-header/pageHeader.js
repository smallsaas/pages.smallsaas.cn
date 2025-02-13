/**
    * @author
    * @editor
    * @updated
    * @desc  实现当前页面在系统层级结构中的位置，并能向上返回，点击某层时跳转到相应层页面
    * @eg
    <PageHeader>
      onTabChange = {(data) => {}}   //tab切换时调用
      routes = []           //router 的路由栈信息
      params = {}          //路由的参数
      location = {}       //历史路由信息
      breadcrumbNameMap = ''
      breadcrumbList = []
      breadcrumbSeparator
      linkElement = 'a'
      homeText = '首页'        //初始值tab值为首页
      title = ''               //标题
      logo = ''               //logo图片
      action = ''
      content = ''           //内容等
      extraContent = ''       //其他描述
      tabList = []
      className = ''
      tabActiveKey = ''       //当前的tab key值
      tabDefaultActiveKey = ''
      tabBarExtraContent = ''
    </PageHeader>
 */

import React, { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
import pathToRegexp from 'path-to-regexp';
import { Breadcrumb, Tabs } from 'antd';
import classNames from 'classnames';
import './index.css';
import { urlToList } from './pathTools';

const { TabPane } = Tabs;
export function getBreadcrumb(breadcrumbNameMap, url) {
  let breadcrumb = breadcrumbNameMap[url];
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach(item => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item];
      }
    });
  }
  return breadcrumb || {};
}

export default class PageHeader extends PureComponent {
  static contextTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  state = {
    breadcrumb: null,
  };

  componentDidMount() {
    this.getBreadcrumbDom();
  }
  componentWillReceiveProps() {
    this.getBreadcrumbDom();
  }

  onChange = key => {
    if (this.props.onTabChange) {
      this.props.onTabChange(key);
    }
  };
  getBreadcrumbProps = () => {
    return {
      routes: this.props.routes || this.context.routes,
      params: this.props.params || this.context.params,
      routerLocation: this.props.location || this.context.location,
      breadcrumbNameMap: this.props.breadcrumbNameMap || this.context.breadcrumbNameMap,
    };
  };
  getBreadcrumbDom = () => {
    const breadcrumb = this.conversionBreadcrumbList();
    this.setState({
      breadcrumb,
    });
  };
  // Generated according to props
  conversionFromProps = () => {
    const { breadcrumbList, breadcrumbSeparator, linkElement = 'a' } = this.props;
    return (
      <Breadcrumb className='kc-page-header-breadcrumb' separator={breadcrumbSeparator}>
        {breadcrumbList.map(item => (
          <Breadcrumb.Item key={item.title}>
            {item.href
              ? createElement(
                  linkElement,
                  {
                    [linkElement === 'a' ? 'href' : 'to']: item.href,
                  },
                  item.title
                )
              : item.title}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  };
  conversionFromLocation = (routerLocation, breadcrumbNameMap) => {
    const { homeText = '首页', breadcrumbSeparator, linkElement = 'a' } = this.props;
    // Convert the url to an array
    const pathSnippets = urlToList(routerLocation.pathname);
    // Loop data mosaic routing
    const extraBreadcrumbItems = pathSnippets.map((url, index) => {
      const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
      const isLinkable = index !== pathSnippets.length - 1 && currentBreadcrumb.component;
      return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb ? (
        <Breadcrumb.Item key={url}>
          {createElement(
            isLinkable ? linkElement : 'span',
            { [linkElement === 'a' ? 'href' : 'to']: url },
            currentBreadcrumb.name
          )}
        </Breadcrumb.Item>
      ) : null;
    });
    // Add home breadcrumbs to your head
    extraBreadcrumbItems.unshift(
      <Breadcrumb.Item key="home">
        {createElement(
          linkElement,
          {
            [linkElement === 'a' ? 'href' : 'to']: '/',
          },
          homeText,
        )}
      </Breadcrumb.Item>
    );
    return (
      <Breadcrumb className='kc-page-header-breadcrumb' separator={breadcrumbSeparator}>
        {extraBreadcrumbItems}
      </Breadcrumb>
    );
  };
  /**
   * 将参数转化为面包屑
   * Convert parameters into breadcrumbs
   */
  conversionBreadcrumbList = () => {
    const { breadcrumbList, breadcrumbSeparator } = this.props;
    const { routes, params, routerLocation, breadcrumbNameMap } = this.getBreadcrumbProps();
    if (breadcrumbList && breadcrumbList.length) {
      return this.conversionFromProps();
    }
    // 如果传入 routes 和 params 属性
    // If pass routes and params attributes
    if (routes && params) {
      return (
        <Breadcrumb
          className='kc-page-header-breadcrumb'
          routes={routes.filter(route => route.breadcrumbName)}
          params={params}
          itemRender={this.itemRender}
          separator={breadcrumbSeparator}
        />
      );
    }
    // 根据 location 生成 面包屑
    // Generate breadcrumbs based on location
    if (routerLocation && routerLocation.pathname) {
      return this.conversionFromLocation(routerLocation, breadcrumbNameMap);
    }
    return null;
  };
  // 渲染Breadcrumb 子节点
  // Render the Breadcrumb child node
  itemRender = (route, params, routes, paths) => {
    const { linkElement = 'a' } = this.props;
    const last = routes.indexOf(route) === routes.length - 1;
    return last || !route.component ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      createElement(
        linkElement,
        {
          href: paths.join('/') || '/',
          to: paths.join('/') || '/',
        },
        route.breadcrumbName
      )
    );
  };

  render() {
    const {
      title,
      logo,
      action,
      content,
      extraContent,
      tabList,
      className,
      tabActiveKey,
      tabDefaultActiveKey,
      tabBarExtraContent,
    } = this.props;

    const clsString = classNames('kc-page-header', className);
    const activeKeyProps = {};
    if (tabDefaultActiveKey !== undefined) {
      activeKeyProps.defaultActiveKey = tabDefaultActiveKey;
    }
    if (tabActiveKey !== undefined) {
      activeKeyProps.activeKey = tabActiveKey;
    }

    return (
      <div className={clsString}>
        {this.state.breadcrumb}
        <div className='kc-page-header-detail'>
          {logo && <div className='kc-page-header-logo'>{logo}</div>}
          <div className='kc-page-header-main'>
            <div className='kc-page-header-row'>
              {title && <h1 className='kc-page-header-title'>{title}</h1>}
              {action && <div className='kc-page-header-action'>{action}</div>}
            </div>
            <div className='kc-page-header-row'>
              {content && <div className='kc-page-header-content'>{content}</div>}
              {extraContent && <div className='kc-page-header-extraContent'>{extraContent}</div>}
            </div>
          </div>
        </div>
        {tabList &&
          tabList.length && (
            <Tabs
              className='kc-page-header-tabs'
              {...activeKeyProps}
              onChange={this.onChange}
              tabBarExtraContent={tabBarExtraContent}
            >
              {tabList.map(item => <TabPane tab={item.tab} key={item.key} />)}
            </Tabs>
          )}
      </div>
    );
  }
}
