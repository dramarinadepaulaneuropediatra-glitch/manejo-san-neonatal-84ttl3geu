import pb from '@/lib/pocketbase/client'

export const getSections = async () => {
  return pb.collection('sections').getFullList({ sort: 'order' })
}

export const getSectionByOrder = async (order: number) => {
  return pb.collection('sections').getFirstListItem(`order=${order}`)
}

export const getInteractionsBySection = async (sectionId: string) => {
  return pb.collection('interactions').getFullList({ filter: `section_id="${sectionId}"` })
}

export const saveResponse = async (interactionId: string, answer: any) => {
  const userId = pb.authStore.record?.id
  if (!userId) throw new Error('User not authenticated')

  // Check if response already exists
  try {
    const existing = await pb
      .collection('responses')
      .getFirstListItem(`interaction_id="${interactionId}" && user_id="${userId}"`)
    return pb.collection('responses').update(existing.id, { answer })
  } catch {
    return pb.collection('responses').create({
      user_id: userId,
      interaction_id: interactionId,
      answer,
    })
  }
}

export const getMyResponse = async (interactionId: string) => {
  const userId = pb.authStore.record?.id
  if (!userId) return null
  try {
    return await pb
      .collection('responses')
      .getFirstListItem(`interaction_id="${interactionId}" && user_id="${userId}"`)
  } catch {
    return null
  }
}

export const getAllResponsesForInteraction = async (interactionId: string) => {
  return pb.collection('responses').getFullList({
    filter: `interaction_id="${interactionId}"`,
    expand: 'user_id',
  })
}

export const markSectionComplete = async (sectionId: string) => {
  const userId = pb.authStore.record?.id
  if (!userId) return
  try {
    const existing = await pb
      .collection('progress')
      .getFirstListItem(`section_id="${sectionId}" && user_id="${userId}"`)
    if (!existing.completed) {
      await pb.collection('progress').update(existing.id, { completed: true })
    }
  } catch {
    await pb.collection('progress').create({
      user_id: userId,
      section_id: sectionId,
      completed: true,
    })
  }
}

export const getMyProgress = async () => {
  const userId = pb.authStore.record?.id
  if (!userId) return []
  return pb.collection('progress').getFullList({ filter: `user_id="${userId}" && completed=true` })
}

export const getMedications = async () => {
  return pb.collection('medications').getFullList({ sort: 'name' })
}
