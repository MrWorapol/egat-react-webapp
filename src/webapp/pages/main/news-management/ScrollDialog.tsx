import React from 'react'
import {Paper, Typography, Button,Box } from '@mui/material'
import { NewsInfo } from '../../../state/news-management/news-info';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useDialog } from '../../../hooks/useDialog';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw } from 'draft-js';
import { markdownToDraft } from 'markdown-draft-js';
import MarkdownPreview from '@uiw/react-markdown-preview';//https://github.com/uiwjs/react-markdown-preview

export default function ScrollDialog({ NewsPara }: { NewsPara: NewsInfo }) {
    const { closeDialog } = useDialog();
    const ID = NewsPara?.id
    const tittle = NewsPara?.title;
    var stringcontent = "stringholder";
    var content = EditorState.createEmpty();
    const [editorState, setEditorState] = React.useState(
        () => {
            if (typeof (NewsPara?.content) === 'string') {
                stringcontent = NewsPara?.content;
                // console.log(stringcontent)
            };
            const contentState = convertFromRaw(markdownToDraft(stringcontent));
            // console.log(contentState);
            return content
                ? EditorState.createWithContent(contentState)
                : EditorState.createEmpty();
        }
    );
    return (
        <div>
            <Dialog
                open={true}
                fullWidth={true}
                maxWidth="md"
                PaperProps={{
                    sx: {
                        mx: 5,
                        width: "941",
                        height: "599"
                    }
                }}
                scroll="paper"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">
                    <Typography color='secondary.main' variant='h6' sx={{ fontWeight: 'bold' }}>
                        News ID : {ID}
                    </Typography>
                </DialogTitle>
                <DialogTitle sx={{ mx: 5 }}>Title: {tittle}</DialogTitle>
                
                <DialogContent sx={{ mx: 5 }}>
                    { <Paper variant="outlined">
                        {/* <Editor
                            editorState={editorState}
                            toolbarHidden
                            readOnly
                        /> */}
                        <MarkdownPreview source={NewsPara?.content} />
                    </Paper>}
    
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={closeDialog}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}