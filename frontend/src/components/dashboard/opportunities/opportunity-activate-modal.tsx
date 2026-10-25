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
      showActivationChangingStatus: boolean;
      setshowActivationChangingStatus: (value: boolean) => void;
      handleChangeActivationStatus: () => void;
}

const OpportunityModalActivationEdit:React.FC<OpportunityModalDeleteProps> = (
      { showActivationChangingStatus, setshowActivationChangingStatus, handleChangeActivationStatus }
) => {
  return (
      <AlertDialog open={showActivationChangingStatus} onOpenChange={setshowActivationChangingStatus}>
      <AlertDialogContent>
            <AlertDialogHeader>
                  <AlertDialogTitle>هل أنت متأكد من تغيير تفعيل الفرصة التطوعية  </AlertDialogTitle>
                  <AlertDialogDescription>
                  </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction
                        onClick={handleChangeActivationStatus}
                        className="bg-primary text-destructive-foreground hover:bg-primary/90"
                  >
                        تأكيد
                  </AlertDialogAction>
            </AlertDialogFooter>
      </AlertDialogContent>
</AlertDialog>
  )
}

export default OpportunityModalActivationEdit
