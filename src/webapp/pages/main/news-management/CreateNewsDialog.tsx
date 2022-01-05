import { Button, DialogActions, DialogContent, DialogTitle, TextField, Typography, FormGroup, Dialog, Paper} from '@mui/material';
import React,{ Component, useState } from 'react';
import { useDialog } from '../../../hooks/useDialog';
import { ChangeHandler, useForm } from 'react-hook-form';
import { NewsCreationState,newscreation } from '../../../state/news-management/news-creation-state';
import { render } from "react-dom";
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor}  from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';//render
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { useRecoilState } from 'recoil';
import { useAllNews } from '../../../hooks/useAllNews';
import NewsManagementAPI from '../../../api/news/newsManagementApi';

;//npm i markdown-draft-js -s

export default function CreateNewsDialog(this: any) {
    const { closeDialog } = useDialog();
    const { putRecentsNews} = useAllNews();
    const api = new NewsManagementAPI();
    // const [] = useRecoilState(newscreation);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<NewsCreationState>();
    const onSubmitForm = (data: NewsCreationState) => {
       data.content = markdown;
       putRecentsNews(data);
      //put api post here
       
      // console.log('data');
      // console.log(data);
      //  console.log(RecentNews);
      //  refreshAllNews();
    };
    const [markdown,setMarkdown] = useState("");

    return (
        <>
            <Dialog
              open = {true}
              fullWidth={true}
              maxWidth = "md"
              PaperProps={{ 
                sx: { 
                  width: "941", 
                  height: "599" 
                }
              }}
              scroll = 'paper'
              >
              
              <DialogTitle>
                  <Typography color='secondary.main' variant='h6' sx={{ fontWeight: 'bold' }}>
                      Create News
                  </Typography>
              </DialogTitle>

              <form onSubmit={handleSubmit(onSubmitForm)}>
                  <DialogContent sx={{ mx: 2 , fontWeight: 'bold' }}>
                      <TextField
                          autoFocus
                          margin="dense"
                          id="title"
                          label="Title"
                          type="title"
                          fullWidth
                          variant="standard"
                          {...register("title")}
                      />
                  </DialogContent>
                    <FormGroup sx={{ mx: 5 }}>
                      <Paper>
                            <ControlledEditor 
                            onNewMarkdown = {setMarkdown}
                            />
                      </Paper>
                    </FormGroup>
                  <DialogActions>
                      <Button variant='outlined' onClick={closeDialog}>
                          Close
                      </Button>
                      <Button variant='contained' type="submit">
                          Create
                      </Button>
                  </DialogActions>
              </form>
            </Dialog>
        </>
    )

}

interface Props {
  onNewMarkdown : (markdown : string) => void ;  
};

interface State {
  editorState: EditorState;
};

const styles = {
  editor: {
    border: '1px solid #DBDBDB',
    cursor: 'text',
    minHeight: 288,
    padding: 5,
  },
};

class ControlledEditor extends Component <Props, State> {
  constructor(props : any) {
      super(props);
        this.state = {
          editorState: EditorState.createEmpty(),
        };

      }

  onEditorStateChange = (editorState : EditorState) => {
    this.setState({
      editorState,
    });


    const content = editorState.getCurrentContent();
    const rawObject = convertToRaw(content);
    const markdownString = draftToMarkdown(rawObject);

    this.props.onNewMarkdown(markdownString);

    //console.log(editorState.getCurrentContent().getPlainText())
  };
  
  render() {
      const { editorState } = this.state;
      return (
        <div>
          <Editor
            toolbarClassName="demo-toolbar"
            editorState={editorState}
            placeholder="New Content Here"
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={
              this.onEditorStateChange
            }
            editorStyle = { styles.editor}
            toolbar={{
              options: ['inline', 'blockType', 'list' , 'fontSize', 'fontFamily','textAlign','link'],
              inline: {
                inDropdown: false,
                options: ['bold', 'italic'],
              },
              blockType: {
                inDropdown: false,
                options: ['Blockquote', 'Code'],
              },
              textAlign: { inDropdown: true },
              list: { inDropdown: false },
            }}
          />
        </div>            
      );     
  }        
}
