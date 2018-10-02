import { clipboard } from 'electron'
import swal from 'sweetalert'

export async function showCopyAlert(text: string, content: string): Promise<any> {
  await swal({
    text,
    buttons: {
      copy: {
        value: content,
      },
    },
    icon: 'info',
    title: 'Notice!',
  })

  clipboard.writeText(content)

  return swal('Success!', 'Information copied to clipboard', 'success')
}
