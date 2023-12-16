import React, { useState, useEffect } from 'react'

const DefaultHook = props => {
  const { item, managedCallback } = props
  const [isLoaded, updateLoading] = useState(false)

  useEffect(() => {
    if (isLoaded) return
    if (item?.action) {
      managedCallback({ item }).then(result => {
        updateLoading(true)
      })
    }
    
return () => {
      managedCallback({ item })
    }
  }, [isLoaded])

  return null
}

export default DefaultHook
