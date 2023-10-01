'use client'
import PageContainer from '@/components/admin/container/PageContainer'
import AdminSearchBar from '@/components/shared/AdminSearchBar/AdminSearchBar'
import DashboardCard from '@/components/shared/DashboardCard'
import { Alert, AlertTitle, Box, Button, Grid, } from '@mui/material'
import { IconPlus, } from '@tabler/icons-react'
import React, { useState, useEffect } from 'react'
import { useConfirm } from 'material-ui-confirm'
import CreateCategoriesModal from '@/components/admin/Categories/CreateCategoriesModal/CreateCategoriesModal'
import UpdateCategoriesModal from '@/components/admin/Categories/UpdateCategoriesModal/UpdateCategoriesModal'
import { toast } from 'react-toastify';
import CategoriesTableData from '@/components/admin/Categories/CategoriesTableData/CategoriesTableData'
import useAxiosAuth from '@/lib/hooks/utils/useAxiosAuth'
import useAPIParentCategory from '@/lib/hooks/api/useAPIParentCategory'

const categoriesManagementPage = () => {
  const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
  const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false);
  const [categorySelected, setCategorySelected] = useState<IParentCategory | null>(null);
  const confirm = useConfirm();

  const { getParentCategoryList, deleteCategoryById } = useAPIParentCategory()
  const { data, mutate, isLoading, error } = getParentCategoryList()

  const handleDeleteData = async (id: number) => {
    confirm({
      title: `Đồng ý xóa ${id} ?`,
      description: 'Bạn có chắc chắn muốn thực hiện hành động này?',
    })
      .then(async () => {
        try {
          const response = await deleteCategoryById(id)
          mutate()
          toast.success("Delete category complete id: " + id)
        }
        catch (e) {
          toast.error("Something when wrong, please try again")
        }
      })
  }

  return (
    <>
      <PageContainer title='Categories CRUD' description='My CRUD Operation for categories'>
        <Grid item xs={12} lg={8}>
          <DashboardCard
            title='Parent categories List'
            subtitle='Manage parent categories list'
          >
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
              {error && (
                <Alert sx={{ mb: 2 }} severity="error">
                  <AlertTitle>Error</AlertTitle>
                  Something when wrong — <strong>check your connection and reload page!</strong>
                </Alert>
              )}
              <AdminSearchBar />
              <Button
                sx={{ mt: 2 }}
                startIcon={<IconPlus />}
                color="success"
                size='small'
                disableElevation
                variant="contained"
                onClick={() => {
                  setShowModalCreate(true);
                }}>
                Add new
              </Button>
              <CategoriesTableData
                categoryList={data}
                setShowModalUpdate={setShowModalUpdate}
                handleDeleteData={handleDeleteData}
                setCategorySelected={setCategorySelected}
              />
            </Box>
          </DashboardCard>
        </Grid>
        <CreateCategoriesModal
          setShowModalCreate={setShowModalCreate}
          showModalCreate={showModalCreate}
        />
        <UpdateCategoriesModal
          showModalUpdate={showModalUpdate}
          setShowModalUpdate={setShowModalUpdate}
          categorySelected={categorySelected}
          setCategorySelected={setCategorySelected}
        />
      </PageContainer>
    </>
  )
}

export default categoriesManagementPage
