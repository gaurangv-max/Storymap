import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ButtonBase from '@mui/material/ButtonBase';
import { Button } from '../shared/Button';
import type { Comment } from '../../types';
import { formatDateDMY } from '../../lib/dateFormat';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

// Collapsed view shows the most recent comment only; "View All" expands.
const COLLAPSED_COUNT = 1;

// "Add Comment" column from the Figma design: a comment field with a primary
// "Post" button, followed by the comment list (avatar, name, date, reply, text)
// and a "View All" toggle. Entity-agnostic — used for both stories and steps.
export function CommentSection({ comments: rawComments, onAddComment }: CommentSectionProps) {
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const post = () => {
    if (!text.trim()) return;
    onAddComment(text);
    setText('');
  };

  // Newest first.
  const comments = [...rawComments].reverse();
  const visible = expanded ? comments : comments.slice(0, COLLAPSED_COUNT);

  return (
    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <Typography
        sx={{ mb: 1, fontSize: 14, fontWeight: 600, lineHeight: '22px', color: 'text.secondary' }}
      >
        Add Comment
      </Typography>

      {/* Input + Post button */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <InputBase
          inputRef={inputRef}
          fullWidth
          placeholder="Write a Comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              post();
            }
          }}
          sx={{
            height: 48,
            px: 2,
            borderRadius: '8px',
            bgcolor: 'grey.200',
            fontSize: 14,
            color: 'text.primary',
            '& input::placeholder': { color: 'text.disabled', opacity: 1 },
          }}
        />
        <Button onClick={post} disabled={!text.trim()} sx={{ height: 48, px: 3, flexShrink: 0 }}>
          Post
        </Button>
      </Box>

      {/* Comment list */}
      <Box sx={{ mt: 2 }}>
        {comments.length === 0 ? (
          <Typography sx={{ fontSize: 14, color: 'text.disabled' }}>
            No comments yet. Be the first to add one.
          </Typography>
        ) : (
          <>
            {visible.map((c) => (
              <CommentItem key={c.id} comment={c} onReply={() => inputRef.current?.focus()} />
            ))}
            {comments.length > COLLAPSED_COUNT && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <ButtonBase
                  onClick={() => setExpanded((v) => !v)}
                  sx={{ fontSize: 13, fontWeight: 700, color: 'primary.main', px: 1, py: 0.5, borderRadius: 1 }}
                >
                  {expanded ? 'Show Less' : 'View All'}
                </ButtonBase>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

function CommentItem({ comment, onReply }: { comment: Comment; onReply: () => void }) {
  return (
    <Box sx={{ py: 1.5 }}>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.lighter', color: 'primary.dark' }}>
          {comment.author.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: '18px', color: 'text.primary' }}>
                {comment.author}
              </Typography>
              <Typography sx={{ fontSize: 11, lineHeight: '14px', color: 'text.disabled' }}>
                {formatDateDMY(comment.createdAt)}
              </Typography>
            </Box>
            <ButtonBase
              onClick={onReply}
              sx={{ fontSize: 13, fontWeight: 700, color: 'primary.main', px: 0.5, borderRadius: 1, flexShrink: 0 }}
            >
              Reply
            </ButtonBase>
          </Box>
          <Typography sx={{ mt: 1, fontSize: 14, lineHeight: '22px', color: 'text.secondary' }}>
            {comment.text}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mt: 1.5 }} />
    </Box>
  );
}
