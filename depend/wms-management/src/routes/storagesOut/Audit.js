import React, { PureComponent, Fragment } from 'react';
import Query from '../../components/query';

export default class Audit extends PureComponent {
  render() {
    return (
      <Query
        {...this.props}
        queryConfig={{
          title: '出库审核',
          itemsField: 'storageOutItems',
          // itemsFieldMap: 'storageOutItems',
          info: [
            { label: '出库编号', field: 'transactionCode' },
            { label: '仓库', field: 'warehouseName' },
            { label: '经办人', field: 'transactionBy' },
            { label: '出库日期', field: 'transactionTime' },
            { label: '订单号信息', field: 'outOrderNum' },
            { label: '客户', field: 'distributorCustomer' },
            { label: '制单人', field: 'originatorName' },
            { label: '备注', field: 'note' },
          ],
          columns: [
            { title: ' ', field: 'total' },
            { title: '商品条码', field: 'skuBarcode' },
            { title: '商品编号', field: 'skuCode' },
            { title: '商品名称', field: 'skuName' },
            { title: '商品价格', field: 'transactionSkuPrice', align: 'right', valueType: 'currency' },
            { title: '需求数量', field: 'demandQuantities', align: 'right', bottomTotal: true },
            { title: '出库数量', field: 'transactionQuantities', align: 'right', bottomTotal: true, valueType: 'editQuantity' },
            { title: '单位', field: 'skuUnit' },
          ]
        }}
        audit={{
          API: '/api/wms/storages/out',
          permission: 'wms.out.audit',
        }}
      />
    );
  }
}