export function checkAllFilesSame(selected_files){
    return selected_files.every(f => f.ai_enabled === true) || selected_files.every(f => f.ai_enabled === false)
}

export function getActions(selected_files){
    const n_files = selected_files.length
    if(n_files === 0) return [];
    const all_folders = selected_files.every(f => f.isDirectory)
    const all_files = selected_files.every(f => !f.isDirectory)
    if (!all_folders && !all_files) return [];
    const folder_phrase = n_files == 1 ? "this folder" : "these folders" 
    if(all_folders){
        return [
            [`Enable AI`, true],
            [`Disable AI`, false],
        ]
    }
    if(!checkAllFilesSame(selected_files)) return [];
    const file_phrase = n_files == 1 ? "this file" : "these files" 
    return [
            !selected_files[0].ai_enabled ? [`Enable AI`,true] : [`Disable AI`, false]
        ]
}