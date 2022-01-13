import { Button, DialogActions, DialogContent, DialogTitle, TextField, Typography, FormGroup, Dialog, Paper} from '@mui/material';
import { Component, useState } from 'react';
import { useDialog } from '../../../hooks/useDialog';
import { useForm } from 'react-hook-form';
import { NewsCreationState} from '../../../state/news-management/news-creation-state';
import { EditorState,  convertToRaw } from 'draft-js';
import { Editor}  from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';//render
import { draftToMarkdown} from 'markdown-draft-js';

import { useAllNews } from '../../../hooks/useAllNews';
import NewsManagementAPI from '../../../api/news/newsManagementApi';
import { NewsInfo } from '../../../state/news-management/news-info';
import { INewsDetail, newsDetail } from '../../../state/news-management/news-detail';

import { useSnackbar } from '../../../hooks/useSnackbar';
//npm i markdown-draft-js -s

export default function CreateNewsDialog(this: any) 
{   
    const { closeDialog } = useDialog();
    const { showSnackbar } = useSnackbar();
    const { putRecentsNews} = useAllNews();
    const api = new NewsManagementAPI();
    // const [] = useRecoilState(newscreation);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<NewsCreationState>();
    const onSubmitForm = (data: NewsCreationState) => 
    {
       data.content = markdown;
       putRecentsNews(data);
     
       if (typeof (data?.title) === 'string' &&
        typeof (data?.content) === 'string')
        {
          newsrecentDetailholder.title = data.title;
          newsrecentDetailholder.content = data.content;
        }
        callPostapi(newsrecentDetailholder);
      
    }
    const [markdown,setMarkdown] = useState("");


    let newsrecentDetailholder: NewsInfo= {
      id: 'IDholder',
      title: 'Titleholder',
      date: 'Dateholder',
      content: 'Contentholder',
      status: 'DRAFT',
    };

    async function callPostapi(newsDetailholder : NewsInfo) 
    {   
        try {
            //insert Id to newsDetail before send to api
            await api.createNews({
              newsInfo : newsDetailholder,
            });
            showSnackbar({
              message:"Create Successful",
              servirity: "success",
              width: 'sm',
              anchorOrigin : {
                  vertical: 'center',
                  horizontal : 'buttom'
              },
              autoHideDuration : 4000 
          })
        } catch (e) {
            console.log(e);
            showSnackbar({
              message:`Cannot Create with status:\n${e}`,
              servirity: "error",
              width: 'sm',
              anchorOrigin : {
                  vertical: 'center',
                  horizontal : 'buttom'
              },
              autoHideDuration : 4000 
          })
        }
        console.log(`back from api`);
    }
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
