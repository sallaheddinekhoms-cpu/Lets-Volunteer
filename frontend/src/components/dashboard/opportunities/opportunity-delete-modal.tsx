import React from 'react'
import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
} from "@/components/ui/alert-dialog";


interface OpportunityModalDeleteProps {
      showDeleteDialog: boolean;
      setShowDeleteDialog: (value: boolean) => void;
      handleDelete: () => void;
}

const OpportunityModalDelete:React.FC<OpportunityModalDeleteProps> = (
      { showDeleteDialog, setShowDeleteDialog, handleDelete }
) => {
  return (
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
            <AlertDialogHeader>
                  <AlertDialogTitle>هل أنت متأكد من حذف الفرصة التطوعية  </AlertDialogTitle>
                  <AlertDialogDescription>
                        سيتم حذف الفرصة التطوعية. هذا الإجراء لا يمكن التراجع عنه.
                  </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                        حذف الفرصة التطوعية
                  </AlertDialogAction>
            </AlertDialogFooter>
      </AlertDialogContent>
</AlertDialog>
  )
}

export default OpportunityModalDelete
