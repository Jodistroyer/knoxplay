import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'

const DefaultButton = props => {
  const { item, managedCallback } = props
  const { label, disabled } = item

  const [cd, setCd] = useState(disabled)

  useEffect(() => {
    if (disabled?.then) {
      disabled.then(response => setCd(response))
    } else {
      if (typeof disabled === 'string') setCd(!(disabled === 'true'))
      else setCd(!disabled)
    }
  }, [disabled])
  
return (
    <Button disabled={!cd} onClick={() => managedCallback({ item })} variant='contained'>
      {label}
    </Button>
  )
}

export { DefaultButton }
