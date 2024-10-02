import { ConfigProvider, Pagination } from 'antd'

import theme from '../model/PaginationComponent.constants'

interface PaginationComponentProps {
  currentPage: number
  pageSize: number
  total: number
  onChange: (page: number, pageSize: number) => void
}

function PaginationComponent({ currentPage, pageSize, total, onChange }: PaginationComponentProps) {
  return (
    <ConfigProvider theme={theme}>
      <Pagination
        showQuickJumper
        align="center"
        current={currentPage}
        pageSize={pageSize}
        total={total}
        showSizeChanger={false}
        onChange={onChange}
        hideOnSinglePage
        style={{ marginBottom: '10px' }}
      />
    </ConfigProvider>
  )
}

export default PaginationComponent
